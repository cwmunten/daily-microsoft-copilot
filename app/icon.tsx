import { ImageResponse } from 'next/og';

export const size = { width: 512, height: 512 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    <div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',background:'linear-gradient(135deg,#f4f8ff 0%,#eef2ff 45%,#f8f5ff 100%)',borderRadius:112}}>
      <div style={{width:390,height:390,display:'flex',alignItems:'center',justifyContent:'center',borderRadius:96,background:'linear-gradient(135deg,#2563eb 0%,#7c3aed 48%,#d946ef 100%)',boxShadow:'0 28px 70px rgba(67,56,202,.28)'}}>
        <div style={{fontSize:250,lineHeight:1,color:'white',fontWeight:700,transform:'translateY(-6px)'}}>✦</div>
      </div>
    </div>,
    {...size}
  );
}
