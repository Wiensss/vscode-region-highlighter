// expression = /^[ ]*(?:::|REM)\s*(?:(#region)|#endregion).*$/mg

true
::#region
::#endregion

true
REM#region
REM#endregion
true
REM#region
::#endregion

true
REM #region
REM #endregion

true
REM #region
REM #endregion

true
 REM #region
REM #endregion

true
:: #region
:: #endregion

true
::#region-[]
:: #endregion

true
 :: #region
:: #endregion

false
::# region
::#endregion

false
123:: #region
:: #endregion

false
1REM #region
REM #endregion

