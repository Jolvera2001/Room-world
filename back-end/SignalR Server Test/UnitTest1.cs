namespace SignalR_Server_Test;

public class RoomHubConnection
{
    [Fact]
    public async void BasicConnection()
    {
        // creating connection to SignalR Hub
        var connection = new HubConnectionBuilder()
            .WithUrl("http://localhost:5117/room")
            .Build();

        await connection.StartAsync();
        
        // checking connection
        connection.State.Should().Be(HubConnectionState.Connected);
    }

    [Fact]
    public async void ConnectionWithArgs()
    {
        // creating connection to SignalR Hub
        var connection = new HubConnectionBuilder()
            .WithUrl("http://localhost:5117/room")
            .Build();

        await connection.StartAsync();
    }
}