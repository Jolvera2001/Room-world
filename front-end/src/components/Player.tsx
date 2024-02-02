import React, { useState, useEffect } from 'react';

const PlayerComponent: React.FC = () => {
    const [position, setPosition] = useState({x: 0, y: 0});

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            switch (event.key) {
                case 'w':
                    setPosition((prev) => ({...prev, y: prev.y - 0.5}));
                    console.log("pressed W");
                    break;
                case 'a':
                    setPosition((prev) => ({ ...prev, y: prev.x - 0.5 }));
                    console.log("pressed A");
                    break;
                case 's':
                    setPosition((prev) => ({ ...prev, y: prev.y + 0.5 }));
                    console.log("pressed S");
                    break;
                case 'd':
                    setPosition((prev) => ({ ...prev, y: prev.x + 0.5 }));
                    console.log("pressed D");
                    break;
            }
        };

        // attach listener when mounted
        window.addEventListener('keydown', handleKeyDown);

        // detach when not mounted
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []); 

    return (
        <mesh postion={[position.x, position.y, 0]}>
            <boxGeometry />
            <meshStandardMaterial />
        </mesh>
    );
};

export default PlayerComponent