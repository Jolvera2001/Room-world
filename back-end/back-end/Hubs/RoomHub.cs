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

            // creating player to send ot group and add onto dict
            _playerConnections[roomName].TryAdd(Context.ConnectionId, new Player(Context.ConnectionId));

            // in respects to connection
            ConcurrentDictionary<string, Player> respectedDict = _playerConnections[roomName];
            respectedDict.TryRemove(Context.ConnectionId, out _);

            // add to group
            await Groups.AddToGroupAsync(Context.ConnectionId, roomName);

            // send in player list in respects to connected user
            await Clients.Group(roomName).SendAsync("PlayerListUpdate", respectedDict);
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

                ConcurrentDictionary<string, Player> respectedDict = _playerConnections[roomName];
                respectedDict.TryRemove(Context.ConnectionId, out _);

                await Clients.Group(roomName).SendAsync("PlayerListDisconnect", respectedDict);
            }
        }
    }


    public async Task UpdatePosition(int deltaX, int deltaY)
    {
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