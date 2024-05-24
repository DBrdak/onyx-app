﻿namespace Budget.API.Controllers.Counterparties.Requests;

public sealed record UpdateCounterpartyRequest
{
    public string NewName { get; set; }

    private UpdateCounterpartyRequest(string newName)
    {
        NewName = newName;
    }
}