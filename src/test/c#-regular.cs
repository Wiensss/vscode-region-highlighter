# expression = /^[ ]*(?:\/\*\s*(#region)(?:[^0-9a-zA-Z\n].*)*\*\/|\/\/\s*(#region)(?:[^0-9a-zA-Z\n].*)*|\/\*\s*#endregion(?:[^0-9a-zA-Z\n].*)*\*\/|\/\/\s*#endregion(?:[^0-9a-zA-Z\n].*)*)/mg

true
/* #region-d */
/* #endregion */

true
/* #region-d */
// #endregion

true
/* #region s */
// #endregion

true
/* #region 中文 */
// #endregion

true
// #region
// #endregion

false
/*region*/
/*#endregion*/

false
/*#regions*/
/*#endregion*/
