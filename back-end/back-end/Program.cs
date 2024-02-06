using back_end.Hubs;
using Microsoft.Extensions.Options;

var testOrigin = "_testorigin";

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// adding signalR
builder.Services.AddSignalR();

// configuring cross origin
builder.Services.AddCors(option =>
{
    option.AddPolicy(name: testOrigin,
        policy =>
        {
            policy.WithOrigins("http://localhost:5173");
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors(testOrigin);

app.MapHub<RoomHub>("/room");

app.Run();
