using System.Collections.Concurrent;
using Microsoft.AspNetCore.SignalR;
using back_end.Models;

namespace back_end.Hubs;

public class RoomHub : Hub
{
    // How this data structure is set up:
    // [Room,[Playerid, Player()]]
    //improved dictionary for singular data structure
    private static ConcurrentDictionary<string, ConcurrentDictionary<string, Player>> playerConnections = new ConcurrentDictionary<string, ConcurrentDictionary<string, Player>>();
    public override async Task OnConnectedAsync()
    {
        await base.OnConnectedAsync();

        string roomName = Context.GetHttpContext().Request.Query["roomName"];
        if (!string.IsNullOrEmpty(roomName))
        {
            if (!playerConnections.ContainsKey(roomName))
            {
                playerConnections[roomName] = new ConcurrentDictionary<string, Player>();
            }

            playerConnections[roomName].TryAdd(Context.ConnectionId, new Player(Context.ConnectionId));
        
            await Clients.Group(roomName).SendAsync("PlayerCountUpdated", playerConnections[roomName].Count);
        }
    }

    public override async Task OnDisconnectedAsync(Exception exception)
    {
        await base.OnDisconnectedAsync(exception);

        string roomName = Context.GetHttpContext().Request.Query["roomName"];
        if (!string.IsNullOrEmpty(roomName))
        {

            if (playerConnections.ContainsKey(roomName))
            {
                Player? removedPlayer;
                playerConnections[roomName].TryRemove(Context.ConnectionId, out removedPlayer);
            }

            await Clients.Group(roomName).SendAsync("PlayerCountUpdated", playerConnections[roomName].Count);
        }
    }
}