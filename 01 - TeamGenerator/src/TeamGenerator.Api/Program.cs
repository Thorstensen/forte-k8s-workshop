using TeamGenerator.Infrastructure.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c => { c.SwaggerDoc("v1", new() { Title = "TeamGenerator API", Version = "v1" }); });

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Add TeamGenerator services
builder.Services.AddTeamGeneratorServices();

var app = builder.Build();

app.UseRouting();

app.UseCors();

app.UseHttpsRedirection();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "TeamGenerator API v1");
        c.RoutePrefix = string.Empty; // Set Swagger UI at root
    });
}

// Add root redirect to swagger docs - leave at root for now
app.MapGet("/", () => Results.Redirect("/"));

// Add redirect from api/docs to root swagger
app.MapGet("/api/docs", () => Results.Redirect("/"));

// Add health endpoint
app.MapGet("/api/health", () => new { status = "healthy", service = "team-generator" });

app.MapControllers();

app.Run();