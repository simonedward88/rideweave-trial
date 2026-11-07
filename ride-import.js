/* RideWeave local activity-file importer: works entirely in the browser.
   FIT/TCX/GPX files are parsed locally; this module does not upload raw files. */
(()=>{
'use strict';
const FIT_EPOCH=631065600;
const num=x=>Number.isFinite(Number(x))?Number(x):null;
const clean=s=>String(s||'').replace(/[<>]/g,'').slice(0,140);
const dateISO=seconds=>Number.isFinite(seconds)&&seconds>631065600&&seconds<4102444800?new Date(seconds*1000).toISOString():null;
const result=(filename,when,minutes,km,ascent,power,hr,cadence,extras={})=>{
 if(!when||!Number.isFinite(minutes)||minutes<1||minutes>5000)throw Error('No usable ride date or duration in '+filename);
 if(!Number.isFinite(km)||km<0||km>1500)km=0;
 return {date:when.slice(0,10),startTime:when,title:clean(filename.replace(/\.(fit(\.gz)?|tcx|gpx)$/i,'').replace(/[_-]/g,' '))||'Imported ride',duration:Math.round(minutes),distance:Math.round(km*10)/10,ascent:Number.isFinite(ascent)?Math.max(0,Math.round(ascent)):0,power:Number.isFinite(power)?Math.max(0,Math.round(power)):0,avgHr:Number.isFinite(hr)?Math.max(0,Math.round(hr)):0,cadence:Number.isFinite(cadence)?Math.max(0,Math.round(cadence)):0,rpe:0,source:extras.source||'Activity file', ...extras};
};
const utc=fitTime=>dateISO(FIT_EPOCH+fitTime);
function decodeFIT(buf,filename){
 const dv=new DataView(buf),bytes=new Uint8Array(buf);
 if(bytes.length<14)throw Error('FIT file is too short');
 const header=bytes[0],dataSize=dv.getUint32(4,true),dataEnd=header+dataSize;
 if(header<12||header>64||String.fromCharCode(...bytes.slice(8,12))!=='.FIT'||dataEnd>bytes.length)throw Error('Invalid or incomplete FIT file');
 let p=header,defs={},sessions=[],firstRecord=null,lastRecord=null,sumP=0,ctP=0,sumH=0,ctH=0,sumCad=0,ctCad=0,trackDistance=null,trackAscent=0,trackLastAlt=null,records=0,activitySport=null,lastFitTimestamp=null;
 const primitive=(pos,size,type,little)=>{
   if(!size)return null;
   const t=type&31;
   try{
     if(t===7){let end=pos;while(end<pos+size&&bytes[end]!==0)end++;return new TextDecoder('utf-8',{fatal:false}).decode(bytes.subarray(pos,end));}
     if(t===0||t===2||t===10||t===13){let v=dv.getUint8(pos);return v===255?null:v;}
     if(t===1){let v=dv.getInt8(pos);return v===127?null:v;}
     if(t===3||t===11){if(size<2)return null;let v=dv.getUint16(pos,little);return v===65535?null:v;}
     if(t===4){if(size<2)return null;let v=dv.getInt16(pos,little);return v===32767?null:v;}
     if(t===5||t===12){if(size<4)return null;let v=dv.getUint32(pos,little);return v===4294967295?null:v;}
     if(t===6){if(size<4)return null;let v=dv.getInt32(pos,little);return v===2147483647?null:v;}
     if(t===8){if(size<4)return null;let v=dv.getFloat32(pos,little);return Number.isFinite(v)?v:null;}
     if(t===9){if(size<8)return null;let v=dv.getFloat64(pos,little);return Number.isFinite(v)?v:null;}
   }catch(err){return null}
   return null;
 };
 while(p<dataEnd){
   const h=bytes[p++],compressed=!!(h&128),local=compressed?(h>>5)&3:h&15;
   if(!compressed&&(h&64)){
     if(p+5>dataEnd)throw Error('Truncated FIT definition');
     p++;const little=bytes[p++]===0,global=dv.getUint16(p,little);p+=2;
     const n=bytes[p++],fields=[];if(n>100)throw Error('Invalid FIT field definition');
     if(p+3*n>dataEnd)throw Error('Truncated FIT definition fields');
     for(let i=0;i<n;i++){fields.push([bytes[p],bytes[p+1],bytes[p+2]]);p+=3;}
     const dev=[];
     if(h&32){if(p>=dataEnd)throw Error('Truncated FIT developer fields');let nDev=bytes[p++];if(p+3*nDev>dataEnd)throw Error('Truncated FIT developer field');for(let i=0;i<nDev;i++){dev.push(bytes[p+1]);p+=3;}}
     defs[local]={global,fields,dev,little};continue;
   }
   const def=defs[local];if(!def)throw Error('FIT data message without definition');
   let obj={};for(let f of def.fields){let [id,len,t]=f;if(p+len>dataEnd)throw Error('Truncated FIT data field');obj[id]=primitive(p,len,t,def.little);p+=len;}
   for(let len of def.dev){if(p+len>dataEnd)throw Error('Truncated FIT developer data');p+=len;}
   if(compressed){let offset=h&31;if(lastFitTimestamp!==null){let ts=(lastFitTimestamp&~31)+offset;if(ts<lastFitTimestamp)ts+=32;lastFitTimestamp=ts;if(obj[253]==null)obj[253]=ts;}}
   if(Number.isFinite(obj[253]))lastFitTimestamp=obj[253];
   if(def.global===18){sessions.push(obj);if(obj[5]!=null)activitySport=obj[5];}
   if(def.global===20){
     records++;
     if(obj[253]!=null){if(firstRecord===null)firstRecord=obj[253];lastRecord=obj[253];}
     if(obj[7]!=null&&obj[7]>=0&&obj[7]<3000){sumP+=obj[7];ctP++;}
     if(obj[3]!=null&&obj[3]>0&&obj[3]<255){sumH+=obj[3];ctH++;}
     if(obj[4]!=null&&obj[4]>=0&&obj[4]<255){sumCad+=obj[4];ctCad++;}
     if(obj[5]!=null)trackDistance=obj[5]/100/1000;
     let alt=obj[78]!=null?obj[78]/5-500:obj[2]!=null?obj[2]/5-500:null;
     if(alt!=null&&alt>-500&&alt<12000){if(trackLastAlt!==null){let d=alt-trackLastAlt;if(d>1&&d<25)trackAscent+=d;}trackLastAlt=alt;}
   }
 }
 if(activitySport!==null&&activitySport!==2)throw Error('FIT activity does not appear to be cycling');
 const s=sessions.length?sessions.reduce((best,x)=>Number(x[8]||0)>Number(best[8]||0)?x:best,sessions[0]):{};
 const start=s[2]??firstRecord??s[253],finish=lastRecord??s[253];
 let secs=(s[8]!=null?s[8]:s[7]!=null?s[7]:null);secs=secs!==null?secs/1000:finish!=null&&start!=null?finish-start:null;
 const km=s[9]!=null?s[9]/100/1000:trackDistance;
 const power=s[20]!=null?s[20]:ctP?sumP/ctP:null;
 const hr=s[16]!=null?s[16]:ctH?sumH/ctH:null;
 const cadence=s[18]!=null?s[18]:ctCad?sumCad/ctCad:null;
 const ascent=s[22]!=null?s[22]:trackAscent;
 return result(filename,utc(start),secs/60,km,ascent,power,hr,cadence,{source:'FIT file',records,normalizedPower:s[34]??null,elapsedMinutes:s[7]!=null?Math.round(s[7]/60000):null});
}
function xmlDoc(content){let doc=new DOMParser().parseFromString(content,'application/xml');if(doc.querySelector('parsererror'))throw Error('Invalid XML ride file');return doc;}
const elems=(root,name)=>[...root.getElementsByTagName('*')].filter(x=>x.localName===name);
const child=(root,name)=>elems(root,name)[0]||null;
const value=(root,name)=>{let x=child(root,name);return x?num(x.textContent):null;};
function geo(a,b){const r=Math.PI/180,dlat=(b[0]-a[0])*r,dlong=(b[1]-a[1])*r,x=Math.sin(dlat/2)**2+Math.cos(a[0]*r)*Math.cos(b[0]*r)*Math.sin(dlong/2)**2;return 12742*Math.atan2(Math.sqrt(x),Math.sqrt(Math.max(0,1-x)));}
function decodeXML(content,filename,isGPX){
 let doc=xmlDoc(content),points=isGPX?elems(doc,'trkpt'):elems(doc,'Trackpoint');
 if(points.length<2)throw Error('No completed activity trackpoints found');
 let when=null,end=null,dist=0,ascent=0,lastAlt=null,lastCoord=null,lastKnownDistance=null,powers=[],hrs=[],cads=[];
 for(let p of points){let t=child(p,isGPX?'time':'Time')?.textContent||null,ts=t?new Date(t).getTime():NaN;
   if(Number.isFinite(ts)){if(when===null)when=ts;end=ts;}
   let coord;
   if(isGPX){let a=num(p.getAttribute('lat')),b=num(p.getAttribute('lon'));if(a!=null&&b!=null)coord=[a,b];}
   else {let pos=child(p,'Position');let a=pos?value(pos,'LatitudeDegrees'):null,b=pos?value(pos,'LongitudeDegrees'):null;if(a!=null&&b!=null)coord=[a,b];}
   if(coord&&lastCoord)dist+=geo(lastCoord,coord);if(coord)lastCoord=coord;
   let d=value(p,'DistanceMeters');if(d!=null)lastKnownDistance=d/1000;
   let h=value(p,isGPX?'ele':'AltitudeMeters');if(h!=null){if(lastAlt!==null){let delta=h-lastAlt;if(delta>1&&delta<25)ascent+=delta;}lastAlt=h;}
   let pow=value(p,'Watts')??value(p,'power');if(pow!=null&&pow>=0&&pow<3000)powers.push(pow);
   let hrTag=child(p,'HeartRateBpm');let hr=hrTag?value(hrTag,'Value'):null;if(hr!=null&&hr>0)hrs.push(hr);
   let cad=value(p,'Cadence');if(cad!=null)cads.push(cad);
 }
 if(when===null||end===null||end-when<60000)throw Error('This appears to be a route, not a recorded timed ride');
 let duration=(end-when)/60000;
 if(!isGPX){let laps=elems(doc,'Lap');let sum=0,sumDist=0;for(let lap of laps){let t=value(lap,'TotalTimeSeconds'),d=value(lap,'DistanceMeters');if(t!=null)sum+=t;if(d!=null)sumDist+=d/1000;}if(sum>0)duration=sum/60;if(sumDist>0)lastKnownDistance=sumDist;}
 const mean=a=>a.length?a.reduce((x,y)=>x+y,0)/a.length:null;
 return result(filename,new Date(when).toISOString(),duration,lastKnownDistance??dist,ascent,mean(powers),mean(hrs),mean(cads),{source:isGPX?'GPX activity':'TCX activity',records:points.length});
}
async function parse(file){
 if(file.size>25*1024*1024)throw Error(file.name+': file exceeds 25 MB');
 let name=file.name.toLowerCase();
 if(name.endsWith('.fit.gz')){
   if(typeof DecompressionStream==='undefined')throw Error('This browser cannot decompress .fit.gz. Unzip it first.');
   let arr=await new Response(file.stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer();return decodeFIT(arr,file.name);
 }
 if(name.endsWith('.fit'))return decodeFIT(await file.arrayBuffer(),file.name);
 if(name.endsWith('.tcx'))return decodeXML(await file.text(),file.name,false);
 if(name.endsWith('.gpx'))return decodeXML(await file.text(),file.name,true);
 throw Error('Unsupported format; select .fit, .fit.gz, .tcx, or timed .gpx');
}
window.RideWeaveImport={parse};
})();