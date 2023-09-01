// expression = /^[ ]*\/\/\s*(?:(#region)|#endregion)(?:[ ]+\S*)*$/mg

true
// #region
// #endregion

true
 // #region
// #endregion

true
// #region
 // #endregion

true
 // #region
 // #endregion

true
// #region symbol
// #endregion

true
// #region [symbol]
// #endregion

true
// #region 符号
// #endregion

true
{
	// #region Tab indentation
	// #endregion
}

false
// #regions
// #endregion sd

false
// #region-symbol
// #endregion

false
// # region 
// #endregion

false
123// # region 
// #endregion

false
// #region
// # endregion

false
// #region
// #endregions

false
// #regions
// #endregions
