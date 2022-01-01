# expression = /^[ ]*\/\/\s*(?:(#region(?:[^0-9a-zA-Z\n].*)*|<editor-fold>(?:[^\n]*))|#endregion(?:[^0-9a-zA-Z\n].*)*|<\/editor-fold>(?:[^\n]*))$/mg

true
#region
#endregion

true
 #region
#endregion

true
#region
 #endregion

true
# region
# endregion

true
#region symbol
#endregion

true
#region [symbol]
#endregion

true
#region 符号
#endregion

true
#region-symbol
#endregion

true
#region
# endregion

false
#regions
#endregion sd

false
123# region 
#endregion

false
#regions
#endregion

false
#region
#endregions

false
##region
#endregions