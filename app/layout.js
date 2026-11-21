import './globals.css';
import SpatialEffects from '@/components/SpatialEffects';
export const metadata={title:'APMS — Army Personnel Management System',description:'Academic personnel administration demonstration'};
export default function RootLayout({children}){
  return <html lang="en"><body><div className="ambient" aria-hidden="true"><i/><i/><i/></div><SpatialEffects/>{children}</body></html>
}
