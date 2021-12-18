# expression = /^[ ]*(?:(#Region)|#End Region)(?:[^0-9a-zA-Z\n].*)*$/mg

true
#Region
#End Region

true
 #Region
#End Region

true
#Region
 #End Region

true
#Region symbol
#End Region

true
#Region [symbol]
#End Region

true
#Region 符号
#End Region

true
#Region-symbol
#End Region

false
#Regions
#End Region sd

false
#Region
# End Region

false
# Region
# End Region

false
123# Region 
#End Region

false
#Regions
#End Region

false
#Region
#Endregions

false
##Region
#Endregions