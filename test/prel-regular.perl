# expression = /(?:^[ ]*(#region)(?:[^0-9a-zA-Z\n].*)*$|^(=pod)$)|^[ ]*#endregion(?:[^0-9a-zA-Z\n].*)*$|^=cut$/mg

true
=pod
=cut

true
=pod
=cut

false
 =pod
=cut

true
=pod
#endregion

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
#region
#endregion

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

false
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