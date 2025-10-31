using Microsoft.JSInterop;

namespace FathersComfort.Services;

public class SchedulingService(IJSRuntime jsRuntime) : ISchedulingService
{
    public async Task OpenModalAsync()
    {
        // Check if the widget is available before calling
        var widgetExists = await jsRuntime.InvokeAsync<bool>("eval", "typeof HCPWidget !== 'undefined' && typeof HCPWidget.openModal === 'function'");
    
        if (widgetExists)
        {
            await jsRuntime.InvokeVoidAsync("HCPWidget.openModal");
        }
        else
        {
            // Handle case where script hasn't loaded yet
            Console.WriteLine("HCPWidget not yet available");
        }
    }
}