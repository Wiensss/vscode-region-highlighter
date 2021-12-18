// expression = /^[ ]*\/\/\s*(?:(#region|<editor-fold>)|#endregion|<\/editor-fold>)(?:[ ]+\S*)*$|/mg

true
//#region
//#endregion

true
// #region
// #endregion

true
//<editor-fold>
//</editor-fold>

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
// #region-symbol
// #endregion

false
// #regions
// #endregion sd

false
// # region
// #endregion

false
123 // # region
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