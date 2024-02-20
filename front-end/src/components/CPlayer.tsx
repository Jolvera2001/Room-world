import React, { useState } from "react";
import PlayerType from "../models/Player";

const CPlayerComponent: React.FC<{ somePlayer: PlayerType }> = ({ somePlayer }) => {
    const [properties, setProperties] = useState<PlayerType>(somePlayer);
    return (
        <>
            <mesh position={[properties.x, properties.y, -1]} scale={0.625}>
                <boxGeometry attach={ "geometry" } />
                <meshStandardMaterial />
            </mesh>
        </>
    );
};

export default CPlayerComponent