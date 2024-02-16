// the purpose of this is to debug models and meshes on a more percievable plane
// utilzing grids and such
import React, { ReactNode } from 'react';
import { Grid } from '@react-three/drei'
import { Canvas } from '@react-three/fiber';

interface DCanvasProps {
    children: ReactNode;
}

const DCanvas: React.FC<DCanvasProps> = ({ children }) => {
    return (
        <Canvas>
            <Grid />
            {children}
        </Canvas>
    )
}

export default DCanvas