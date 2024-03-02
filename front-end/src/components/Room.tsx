import { HubConnectionBuilder } from "@microsoft/signalr";
import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import Player from "./Player";
import PlayerType from "../models/Player";
import CPlayerComponent from "./CPlayer";

const RoomComponent: React.FC = () => {
    const [playerList, setPlayerList] = useState<{[key: string]: PlayerType}>({});
    const roomName = "test";
    const connection = new HubConnectionBuilder().withUrl(`http://localhost:5117/room?roomName=${roomName}`).build();

    const getXY = (x: number, y: number) => {
        console.log("x: ", x, "y: ", y);
    }

    useEffect(() => {
        console.table(playerList);
    }, [playerList]);

    useEffect(() => {
        connection.start()
            .then(() => console.log("SignalR connection established"))
            .catch(err => console.error("Error establishing SignalR connection:", err))

        connection.on("PlayerListUpdate", (newPList: { [key:string]: PlayerType}) => {
            console.log("Player List Updated");
            setPlayerList(newPList);
        });

        connection.on("PlayerListDisconnect", (newPList: { [key: string]: PlayerType }) => {
            console.log("player left");
            setPlayerList(newPList);
        });

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
                <Player sendXAndYToParent={getXY}/>
            </Canvas>
        </div>
    )
}

export default RoomComponent