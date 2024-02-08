namespace SignalR_Server_Test;

public class PlayerTests
{
    [Fact]
    public async void BasicConnection()
    {
        var connection = new HubConnectionBuilder()
            .WithUrl("http://localhost:5117/player")
            .Build();

        await connection.StartAsync();

        connection.State.Should().Be(HubConnectionState.Connected);
    }

}