using System.Collections.Concurrent;
using Microsoft.AspNetCore.SignalR;
using back_end.Models;

namespace back_end.Hubs;

public class RoomHub : Hub
{
    // How this data structure is set up:
    // [Room,[Playerid, Player()]]
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

    public async Task UpdatePosition(int deltaX, int deltaY)
    {
        //TODO: Figure out if getting the delta or setting the position directly is better
        // The delta is figured out client side so the majority of the work is done on the client
        // The work here is updating the player position but applying the delta

        string playerId = Context.ConnectionId;
        string roomName = Context.GetHttpContext().Request.Query["roomName"];
        
        if (playerConnections.TryGetValue(roomName, out var roomPlayers) 
            && roomPlayers.TryGetValue(playerId, out Player playerToUpdate))
        {
            playerToUpdate.x += deltaX;
            playerToUpdate.y += deltaY;
            
            // we might need to enforce boundary limits/checks later on

            Clients.Group(roomName).SendAsync("PlayerPositionUpdated", playerId, playerToUpdate.x, playerToUpdate.y);
        }
    }
}