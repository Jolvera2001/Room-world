import { HubConnectionBuilder } from "@microsoft/signalr";
import { useEffect, useState } from "react";
import { Text } from '@react-three/drei';
import { Canvas } from "@react-three/fiber";
import Player from "./Player";

const RoomComponent: React.FC = () => {
    const [playerCount, setPlayerCount] = useState<number>(0);

    useEffect(() => {
        const connection = new HubConnectionBuilder()
            .withUrl("/room")
            .build();

        connection.start()
            .then(() => console.log("SignalR connection established"))
            .catch(err => console.error("Error establishing SignalR connection:", err));

        connection.on("PlayerCountUpdated", (count:number) => {
            setPlayerCount(count);
        })

        return () => {
            connection.stop()
                .then(() => console.log("SignalR connection stopped"))
                .catch(err => console.error("Error stopping signalR connection", err));
        }; 
    }, []);


    return (
        <div className="bg-white">
            <Canvas>
                <ambientLight intensity={0.50} />
                <Text position={[-1, -1, 0]} scale={0.2}>
                    playerCount: {playerCount}
                </Text>
                <Player />
            </Canvas>
        </div>
    )
}

export default RoomComponent