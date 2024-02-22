import { HubConnectionBuilder } from "@microsoft/signalr";
import { useEffect, useState, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import Player from "./Player";
import PlayerType from "../models/Player";
import CPlayerComponent from "./CPlayer";
import PlayerComponent from "./Player";

const RoomComponent: React.FC = () => {
    const [playerList, setPlayerList] = useState<{[key: string]: PlayerType}>({});
    const userId = useRef<string>("");
    const roomName = "test";

    // TODO
    const updatePlayerPosition = (deltaX: number, deltaY: number) => {
        connection.invoke("PlayerPositionUpdated", deltaX, deltaY)
            .then(() => console.log("position updated"))
            .catch(err => console.error("Error updated position: ", err))
    }

    useEffect(() => {
        console.table(playerList);
    }, [playerList]);

    useEffect(() => {
        const connection = new HubConnectionBuilder()
            .withUrl(`http://localhost:5117/room?roomName=${roomName}`)
            .build();

        connection.start()
            .then(() => console.log("SignalR connection established"))
            .catch(err => console.error("Error establishing SignalR connection:", err));
        
        if (connection.connectionId) {
            userId.current = connection.connectionId;
        }

        connection.on("PlayerListUpdate", (newPList: { [key:string]: PlayerType}) => {
            console.log("Player List Updated");

            const updatedPlayerList = {...newPList};
            delete updatedPlayerList[userId.current];

            setPlayerList(updatedPlayerList);
        });

        connection.on("PlayerListDisconnect", (newPList: { [key: string]: PlayerType }) => {
            console.log("player left");

            const updatedPlayerList = { ...newPList };
            delete updatedPlayerList[userId.current];

            setPlayerList(updatedPlayerList);
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
                <Player updatePlayerPosition={updatePlayerPosition}/>
            </Canvas>
        </div>
    )
}

export default RoomComponent