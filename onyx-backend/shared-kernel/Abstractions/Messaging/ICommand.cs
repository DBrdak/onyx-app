﻿using MediatR;
using Models.Responses;

namespace Abstractions.Messaging;

public interface ICommand : IRequest<Result>, IBaseCommand;

public interface ICommand<TReponse> : IRequest<Result<TReponse>>, IBaseCommand;

public interface IBaseCommand;