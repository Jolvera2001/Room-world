using Microsoft.AspNetCore.SignalR;

namespace back_end.Hubs;

public class RoomHub : Hub
{
    // place to store players in our room
    // roomname : set of playerIDs
    private static Dictionary<string, HashSet<string>> roomPlayerConnections = new Dictionary<string, HashSet<string>>();

    public override async Task OnConnectedAsync()
    {
        await base.OnConnectedAsync();

        string roomName = Context.GetHttpContext().Request.Query["roomName"];
        if (!string.IsNullOrEmpty(roomName))
        {
            lock (roomPlayerConnections)
            {
                if (!roomPlayerConnections.ContainsKey(roomName))
                {
                    roomPlayerConnections[roomName] = new HashSet<string>();
                }

                roomPlayerConnections[roomName].Add(Context.ConnectionId);
            }
            
            await Clients.Group(roomName).SendAsync("PlayerCountUpdated", roomPlayerConnections[roomName].Count);
        }
    }

    public override async Task OnDisconnectedAsync(Exception exception)
    {
        await base.OnDisconnectedAsync(exception);

        string roomName = Context.GetHttpContext().Request.Query["roomName"];
        if (!string.IsNullOrEmpty(roomName))
        {
            lock (roomPlayerConnections)
            {
                if (roomPlayerConnections.ContainsKey(roomName))
                {
                    roomPlayerConnections[roomName].Remove(Context.ConnectionId);
                }
            } 
            
            await Clients.Group(roomName).SendAsync("PlayerCountUpdated", roomPlayerConnections[roomName].Count);
        }
    }
}