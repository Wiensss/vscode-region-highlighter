// expression = /^[ ]*(?:(#pragma region)|#pragma endregion)(?:[^0-9a-zA-Z\n].*)*$/mg

true
#pragma region
#pragma endregion

true
 #pragma region
#pragma endregion

true
#pragma region
 #pragma endregion

true
 #pragma region
 #pragma endregion

true
#pragma region symbol
#pragma endregion

true
#pragma region [symbol]
#pragma endregion

true
#pragma region 符号
#pragma endregion

true
#pragma region-symbol
#pragma endregion

false
#pragmaregion-symbol
#pragma endregion

false
#pragma Region-symbol
#pragma endregion

false
#pragma-region
#pragma endregion

false
#pragma regions
#pragma endregion

false
#pragma region
#pragma endregions

false
# pragma regions
#pragma endregion

false
123#pragma regions
#pragma endregion