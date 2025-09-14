using Microsoft.Extensions.DependencyInjection;
using TeamGenerator.Application.Services;
using TeamGenerator.Domain.Repositories;
using TeamGenerator.Domain.Services;
using TeamGenerator.Infrastructure.Repositories;

namespace TeamGenerator.Infrastructure.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddTeamGeneratorServices(this IServiceCollection services)
    {
        services.AddScoped<IPlayerRepository, InMemoryPlayerRepository>();
        services.AddScoped<ITeamGeneratorService, TeamGeneratorService>();
        
        return services;
    }
}