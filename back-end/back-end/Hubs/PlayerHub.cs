using System.Collections.Concurrent;
using Microsoft.AspNetCore.SignalR;
using back_end.Models;

namespace back_end.Hubs;

public class PlayerHub : Hub
{
    private static readonly ConcurrentDictionary<string, Player>
        playerDict = new ConcurrentDictionary<string, Player>();
    
    public override async Task OnConnectedAsync()
    {
        var playerId = Context.ConnectionId;
        var player = new Player(playerId);
        playerDict.TryAdd(playerId, player);

        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception exception)
    {
        var playerId = Context.ConnectionId;
        Player removedPlayer;
        playerDict.TryRemove(playerId, out removedPlayer);

        await base.OnDisconnectedAsync(exception);
    }

    public async Task UpdatePosition(int x, int y)
    {
        var playerId = Context.ConnectionId;
        if (playerDict.TryGetValue(playerId, out var player))
        {
            player.x = x;
            player.y = y;
            await Clients.Others.SendAsync("PlayerPositionUpdated", Context.ConnectionId, x, y);
        }
    }
}