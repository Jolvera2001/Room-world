import { HubConnectionBuilder } from "@microsoft/signalr";
import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import Player from "./Player";
import PlayerType from "../models/Player";
import CPlayerComponent from "./CPlayer";

const RoomComponent: React.FC = () => {
    const [playerCount, setPlayerCount] = useState<number>(0);
    const [playerList, setPlayerList] = useState<{[key: string]: PlayerType}>({});
    const roomName = "test";

    useEffect(() => {
        const connection = new HubConnectionBuilder()
            .withUrl(`http://localhost:5117/room?roomName=${roomName}`)
            .build();

        connection.start()
            .then(() => console.log("SignalR connection established"))
            .catch(err => console.error("Error establishing SignalR connection:", err));

        connection.on("PlayerListUpdate", (newPList: { [key:string]: PlayerType}) => {
            console.log("Player List Updated");
            setPlayerList(newPList);
        });

        connection.on("PlayerListDisconnect", (newPList: { [key: string]: PlayerType }) => {
            console.log("player left");
            setPlayerList(newPList);

        connection.on("PlayerPositionUpdated", (playerId: string, newX: number, newY: number) => {
            setPlayerList(prevPlayerList => ({
                ...prevPlayerList, 
                [playerId]: {
                    ...prevPlayerList[playerId],
                    x: newX,
                    y: newY
                    }
                }));
            });
        });

        return () => {
            connection.stop()
                .then(() => console.log("SignalR connection stopped"))
                .catch(err => console.error("Error stopping signalR connection", err));
        }; 
    }, []);


    return (
        <div className="bg-white h-screen">
            <Canvas>
                <ambientLight intensity={0.50} />
                {Object.values(playerList).map((player) => (
                    <CPlayerComponent key={player.id} somePlayer={player} />
                ))}
                <Player />
            </Canvas>
            <div>
                <p> Player Count: {playerCount}</p>
            </div>
        </div>
    )
}

export default RoomComponent