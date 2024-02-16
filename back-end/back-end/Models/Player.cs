namespace back_end.Models;

public class Player
{
    public string Id { get; set; }
    public int x { get; set; }
    public int y { get; set; }

    public Player(string id)
    {
        Id = id;
    }
    
}