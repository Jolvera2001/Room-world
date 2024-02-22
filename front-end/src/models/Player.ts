interface PlayerType {
    id: string;
    x: number;
    y: number;

    onPositionChange: (x: number, y: number) => void
}

export default PlayerType;
