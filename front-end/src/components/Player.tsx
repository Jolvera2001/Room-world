import React, { useState, useEffect } from 'react';
import { Text } from '@react-three/drei'

interface PlayerComponentProps {
    sendXAndYToParent: (x: number, y: number) => void;
}

const PlayerComponent: React.FC<PlayerComponentProps> = () => {
    const [position, setPosition] = useState({x: 0, y: 0});
    const [keysPressed, setKeysPressed] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            setKeysPressed((prev: any) => ({ ...prev, [event.key]: true }));
          };

        const handleKeyUp = (event: KeyboardEvent) => {
            setKeysPressed((prev: any) => ({ ...prev, [event.key]: false }));
        };

        const updatePosition = () => {
            setPosition((prev) => ({
              x: keysPressed['d'] ? prev.x + 0.05 : keysPressed['a'] ? prev.x - 0.05 : prev.x,
              y: keysPressed['s'] ? prev.y - 0.05 : keysPressed['w'] ? prev.y + 0.05 : prev.y,
            }));
        };

        // attach listeners when mounted
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        // update position continuously
        const updateInterval = setInterval(updatePosition, 20);

        // detach listeners and clearInterval when not mounted
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            clearInterval(updateInterval);
        };
    }, [keysPressed]);

    return (
        <>
            <mesh position={[position.x, position.y, -1]} scale={0.625}>
                <boxGeometry attach={ "geometry" } />
                <meshStandardMaterial />
            </mesh>
            <Text position={[0, 3, 0]} scale={0.5}> 
                x: {position.x.toFixed(2)} y: {position.y.toFixed(2)}
            </Text>
        </>
    );
};

export default PlayerComponent