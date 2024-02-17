using System.Collections.Concurrent;
using Microsoft.AspNetCore.SignalR;
using back_end.Models;

namespace back_end.Hubs;

public class RoomHub : Hub
{
    // How this data structure is set up:
    // [Room,[PlayerId, Player()]]
    private static ConcurrentDictionary<string, ConcurrentDictionary<string, Player>> _playerConnections = new ConcurrentDictionary<string, ConcurrentDictionary<string, Player>>();
    public override async Task OnConnectedAsync()
    {
        await base.OnConnectedAsync();

        string roomName = Context.GetHttpContext().Request.Query["roomName"];

        Console.WriteLine($"RoomName: {roomName}");
        if (!string.IsNullOrEmpty(roomName))
        {
            if (!_playerConnections.ContainsKey(roomName))
            {
                _playerConnections[roomName] = new ConcurrentDictionary<string, Player>();
            }

            _playerConnections[roomName].TryAdd(Context.ConnectionId, new Player(Context.ConnectionId));

            // add to group
            await Groups.AddToGroupAsync(Context.ConnectionId, roomName);
            await Clients.Group(roomName).SendAsync("PlayerCountUpdated", _playerConnections[roomName].Count);

            // TODO: Send the player list to the client
        }
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        await base.OnDisconnectedAsync(exception);

        string roomName = Context.GetHttpContext().Request.Query["roomName"];
        if (!string.IsNullOrEmpty(roomName))
        {

            if (_playerConnections.ContainsKey(roomName))
            {
                Player? removedPlayer;
                _playerConnections[roomName].TryRemove(Context.ConnectionId, out removedPlayer);
            }

            await Clients.Group(roomName).SendAsync("PlayerCountUpdated", _playerConnections[roomName].Count);
        }
    }


    public async Task UpdatePosition(int deltaX, int deltaY)
    {
        //TODO: Test this on the frontend and refactor accordingly
        // The delta is figured out client side so the majority of the work is done on the client
        // The work here is updating the player position but applying the delta

        string playerId = Context.ConnectionId;
        string roomName = Context.GetHttpContext().Request.Query["roomName"];
        
        if (_playerConnections.TryGetValue(roomName, out var roomPlayers) 
            && roomPlayers.TryGetValue(playerId, out Player playerToUpdate))
        {
            playerToUpdate.x += deltaX;
            playerToUpdate.y += deltaY;
            
            // we might need to enforce boundary limits/checks later on

            Clients.Group(roomName).SendAsync("PlayerPositionUpdated", playerId, playerToUpdate.x, playerToUpdate.y);
        }
    }
}