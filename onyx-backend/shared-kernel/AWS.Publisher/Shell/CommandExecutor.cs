﻿using System.Diagnostics;
using AWS.Publisher.Terminal;

namespace AWS.Publisher.Shell;

internal static class CommandExecutor
{
    public static void ExecuteShellCommand(this Command command)
    {
        var process = new Process
        {
            StartInfo = new ProcessStartInfo
            {
                FileName = "cmd.exe",
                Arguments = $"/c {command.Value}",
                RedirectStandardOutput = false,
                RedirectStandardError = false,
                UseShellExecute = false,
                CreateNoWindow = true
            }
        };

        process.Start();
        process.StandardOutput.ReadToEnd();
        var error = process.StandardError.ReadToEnd();
        process.WaitForExit();

        if (string.IsNullOrWhiteSpace(error))
        {
            return;
        }

        Printer.PrintLine($"Error occured when trying to execute command: {command}", ConsoleColor.Red);
        Environment.Exit(1);
    }
}