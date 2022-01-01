<!-- expression = /^[ ]*<!--\s*(?:(#region)|#endregion)(?:[^0-9a-zA-Z\n].*)*-->(?:.*)*$/mg -->

true
<!-- #region -->
<!-- #endregion -->

true
<!--#region -->
<!--#endregion -->

true
<!--#region-[] -->
<!--#endregion-->

true
<!--#region 23-->23
<!--#endregion-->21

true
<!--#region -sd-->
<!--#endregion-->

false
1<!--#region-->
<!--#endregion-->

false
<!--#region23-->
<!--#endregion-->

false
<!--# region-->
<!--#endregion-->

true
 <!-- #region -->
<!-- #endregion -->

true
<!-- #region -->
 <!-- #endregion -->

true
 <!-- #region -->
 <!-- #endregion -->
