﻿namespace SharedDAL.DataModels;

public sealed class DataModelConversionException : Exception
{
    public DataModelConversionException(Type conversionFrom, Type conversionTo) :
        base($"Conversion from {conversionFrom.Name} to {conversionTo.Name} failed") { }
    public DataModelConversionException(Type conversionFrom, Type conversionTo, Type conversionDataModel) :
        base($"Conversion from {conversionFrom.Name} to {conversionTo.Name} failed, on type {conversionDataModel.Name}") { }
    public DataModelConversionException(object conversionFrom, Type conversionTo) :
        base($"Conversion from {conversionFrom.GetType().Name} to {conversionTo.Name} failed") { }
    public DataModelConversionException(object conversionFrom, Type conversionTo, object conversionDataModel) :
        base($"Conversion from {conversionFrom.GetType().Name} to {conversionTo.Name} failed, on type {conversionDataModel.GetType().Name}") { }
}