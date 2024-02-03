import React, { useState, useEffect } from 'react';

const PlayerComponent: React.FC = () => {
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
              x: keysPressed['d'] ? prev.x + 0.1 : keysPressed['a'] ? prev.x - 0.1 : prev.x,
              y: keysPressed['s'] ? prev.y - 0.1 : keysPressed['w'] ? prev.y + 0.1 : prev.y,
            }));
        };

        // attach listeners when mounted
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        // update position continuously
        const updateInterval = setInterval(updatePosition, 22.3);

        // detach listeners and clearInterval when not mounted
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            clearInterval(updateInterval);
        };
    }, [keysPressed]);

    return (
        <mesh position={[position.x, position.y, 0]}>
            <boxGeometry />
            <meshStandardMaterial />
        </mesh>
    );
};

export default PlayerComponent