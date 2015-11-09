angular.module('labs')
    .directive('labOne', function() {
        return {
            restrict: 'E',
            templateUrl: '../../templates/lab-one.html',
            controller: function($scope) {
                // Входные данные
                $scope.Un = [2.5, 3.8, 3.8, 3.8,
                    6.3, 6.3, 4.6, 8.6,
                    4.6, 7.7, 6.5, 10.2,
                    4.6, 8.4, 8.5, 8.4,
                    3.7, 8.5, 5.5, 4.3,
                    11.1, 5.3, 5.5, 10.1,
                    5.7, 4.9, 10.3, 7.9,
                    2.7, 2.3, 6.5, 5.7,
                    4.7, 8.5, 5.5, 4.6,
                    8.8, 8.5, 5.8, 7.6,
                    3.7, 6.5, 6.7, 11.3,
                    10.3, 6.3, 8.6, 13,
                    10.2, 12, 5.7, 10.3,
                    5.5, 3.4, 7.9, 4.9,
                    10.3, 4.6, 8.4, 8.5
                ];
                // -------------------------------------------------
                $scope.Alpha = [0.07, 0.07, 0.09, 0.15,
                    0.015, 0.18, 0.1, 0.28,
                    0.15, 0.23, 0.22, 0.27,
                    0.18, 0.26, 0.27, 0.18,
                    0.05, 0.28, 0.1, 0.08,
                    0.3, 0.08, 0.15, 0.24,
                    0.15, 0.17, 0.27, 0.24,
                    0.06, 0.05, 0.18, 0.12,
                    0.2, 0.22, 0.11, 0.11,
                    0.3, 0.27, 0.16, 0.22,
                    0.04, 0.17, 0.18, 0.31,
                    0.29, 0.16, 0.31, 0.34,
                    0.26, 0.35, 0.17, 0.30,
                    0.1, 0.03, 0.24, 0.18,
                    0.28, 0.09, 0.27, 0.29
                ];
                // -------------------------------------------------	 
                $scope.UnNew = [];
                $scope.AlphaNew = [];
                $scope.charPlotData = [];
                $scope.variant = null;
                $scope.alphaGr = null;
                $scope.UnGr = 0;
                $scope.render = function(points, id){
                        	zingchart.render({ 
                        		id:id,
                        		data:points,
                        		height:400,
                        		width:"100%"
                        	});
                        };
                // -------------------------------------------------
                $scope.getCorrField = function() {
                    if ($scope.variant === null || $scope.alphaGr === null)
                        alert("Вы не заполнили поля")
                    else {
                        //Обнуляем данные форм и массивы
                        $scope.UnNew = [];
                        $scope.AlphaNew = [];
                        $scope.charPlotData = [];
                        $scope.dataset1 = [];
                		$scope.dataset2 = [];
                		$scope.dataset3 = [];
                		$scope.dataset4 = [];
                		$scope.dataset5 = [];
                		$scope.dataset6 = [];
                		$scope.dataset7 = [];
                        // -------------------------------------------------
                        for (var i = 0; i < $scope.Un.length; i++) {
                            if (i === $scope.variant - 1) {
                                $scope.UnGr = $scope.variant * $scope.Un[i];
                            }
                        }
                        // Получаем новый массив Un
                        for (var i = 0; i < $scope.Un.length; i++) {
                            $scope.UnNew[i] = $scope.Un[i] * $scope.variant;
                        }
                        // Получаем новый массив Alpha
                        for (var i = 0; i < $scope.Alpha.length; i++) {
                            $scope.AlphaNew[i] = $scope.Alpha[i] * 1000;
                        }
                        $scope.AlphaMax = Math.max.apply(Math, $scope.AlphaNew);
                        //Максимальное и минимальное Un
                        $scope.UnMax = Math.max.apply(Math, $scope.UnNew);
                		$scope.UnMin = Math.min.apply(Math, $scope.UnNew);
                        //---------------------------------------------------
                        //Построение графика Корреляции
                        for (var i = 0; i < $scope.Un.length; i++) {
                            $scope.charPlotData.push([$scope.UnNew[i], $scope.AlphaNew[i]]);
                        }
                        $scope.chartData = {
                          	"title":{
                        		text:"Поле корреляции"
                        	},
                        	"legend":{
                        		text: "legend"
                        	},
                        	"scale-x":{
    	   						"label":{
    	      						"text":"Un"
          						}
          					},
          					"scale-y":{
    	   						"label":{
    	      						"text":"Alpha"
          						}
          					},
                        	"type":"mixed",
                        	"series":[
    							{
      								"values":$scope.charPlotData,
      								"type":"scatter",
      								"legend-item":{
          							"text":"Результаты"
        							}
      							},
      							{
      								"values":[[$scope.UnGr, 0],[$scope.UnGr,400]],
      								"type":"vline",
      								"legend-item":{
          							"text":"Un граничное"
        							}
      							},
      							{
      								"values":[[0, Math.round($scope.alphaGr)],[$scope.UnMax, Math.round($scope.alphaGr)]],
      								"type":"vline",
      								"legend-item":{
          							"text":"Альфа граничное"
        							}
      							}
                        ]};
                        //Вызов функции рендера графика 
                        $scope.render($scope.chartData,'correlation-field');
                        //Конец построения графика
                        $scope.nTp = 0;//Количество экземпляров верно отнесенных к классу К1(годных)
                        $scope.nTn = 0;//Количество экземпляров верно отнесенных к классу К2(дефектных)
                        $scope.nFp = 0;//Количество дефектных экземпляров ошибочно отнесенных к годным(реш К1|К2)
                        $scope.nFn = 0;//Количество годных экземпляров ошибочно отнесенных к дефектным(реш К2|К1)
                        for(var i = 0; i < $scope.Un.length; i++) {
                        	if($scope.AlphaNew[i]<$scope.alphaGr & $scope.UnNew[i]<$scope.UnGr)
                        		$scope.nTp += 1;
                        	else if($scope.AlphaNew[i]>=$scope.alphaGr & $scope.UnNew[i]>=$scope.UnGr)
                        		$scope.nTn += 1;
                        	else if($scope.AlphaNew[i]<$scope.alphaGr & $scope.UnNew[i]>=$scope.UnGr)
                        		$scope.nFn += 1;
                        	else 
                        		$scope.nFp += 1;
                        }
                        $scope.range = Math.round($scope.UnMax - $scope.UnMin)
                        $scope.nK1 = $scope.nTp + $scope.nFn;
                        $scope.nK2 = $scope.nTn + $scope.nFp;
                        $scope.Perr = ($scope.nFp + $scope.nFn)/$scope.Un.length;
                        $scope.Pcorr = 1 - $scope.Perr;
                        //---------------------------------------------------
                       		$scope.UGr = [];
                        	$scope.Tp = [];
                        	$scope.Tn = [];
                        	$scope.Fp = [];
                        	$scope.Fn = [];
                        	$scope.K1 = [];
                        	$scope.K2 = [];
                        	$scope.prK1 = [];
							$scope.prK2 = [];
							$scope.pK2rK1 = [];
							$scope.pK1rK2 = [];
							$scope.prK1rK2 = [];
							$scope.prK2rK1 = [];
							$scope.nPerr = [];
							$scope.nPcorr = [];
                        for(var i = 0; i<$scope.range;i++){
                        	$scope.UGr[i] = Math.round($scope.UnMin) + i;
                        	$scope.Tp.push(0);
                        	$scope.Tn.push(0);
                        	$scope.Fp.push(0);
                        	$scope.Fn.push(0);
                        	for(var j = 0;j<$scope.Un.length;j++){
                        		if($scope.AlphaNew[j]<$scope.alphaGr && $scope.UnNew[j]<$scope.UGr[i])
                        			$scope.Tp[i] += 1;
                        		else if($scope.AlphaNew[j]>=$scope.alphaGr && $scope.UnNew[i]>=$scope.UGr[i])
                        			$scope.Tn[i] += 1;
                        		else if($scope.AlphaNew[j]<$scope.alphaGr && $scope.UnNew[i]>=$scope.UGr[i])
                        			$scope.Fn[i] += 1;
                        		else 
                        			$scope.Fp[i] += 1;
                        	}
                        $scope.K1.push($scope.Tp[i] + $scope.Fn[i]);
						$scope.K2.push($scope.Tn[i] + $scope.Fp[i]);
						$scope.prK1.push(($scope.Tp[i] + $scope.Fp[i]) / $scope.Un.length);
						$scope.prK2.push(($scope.Tn[i] + $scope.Fn[i]) / $scope.Un.length);
						$scope.pK2rK1.push($scope.Fp[i] / ($scope.Tp[i] + $scope.Fp[i])); // Риск потребителя
						$scope.pK1rK2.push($scope.Fn[i] / ($scope.Tn[i] + $scope.Fn[i])); // Риск изготовителя
						$scope.prK1rK2.push($scope.Fp[i] / $scope.K2[i]);
						$scope.prK2rK1.push($scope.Fn[i] / $scope.K1[i]);
						$scope.nPerr.push(($scope.Fp[i] + $scope.Fn[i]) / $scope.Un.length);
						$scope.nPcorr.push(1 - $scope.nPerr[i]);
						if($scope.pK2rK1[i] > 0)
							if($scope.pK2rK1[i] < 1)
                            $scope.dataset1.push([$scope.UGr[i], $scope.pK2rK1[i]]);
                        if($scope.pK1rK2[i] > 0)
                        	if($scope.pK1rK2[i] < 1)
                            $scope.dataset2.push([$scope.UGr[i], $scope.pK1rK2[i]]);
                        if($scope.prK1rK2[i] > 0)
                        	if($scope.prK1rK2[i] < 1)
                            $scope.dataset3.push([$scope.UGr[i], $scope.prK1rK2[i]]);
                        if($scope.prK2rK1[i] > 0)
                        	if($scope.prK2rK1[i] < 1)
                            $scope.dataset4.push([$scope.UGr[i], $scope.prK2rK1[i]]);
                        if($scope.nPcorr[i] > 0)
                        	if($scope.nPcorr[i] < 1)
                            $scope.dataset5.push([$scope.UGr[i], $scope.nPcorr[i]]);
                        if($scope.prK1[i] > 0)
                        	if($scope.prK1[i] < 1)
                            $scope.dataset6.push([$scope.UGr[i], $scope.prK1[i]]);
                        if($scope.prK2[i] > 0)
                        	if($scope.prK2[i] < 1)
                            $scope.dataset7.push([$scope.UGr[i], $scope.prK2[i]]);
						}
                        //Построение графика зависимости вероятностей от величины порога
                        for (var i = 0; i < $scope.Un.length; i++) {
                        }
                        $scope.chartData2 = {
                          	"title":{
                        		text:"График зависимости вероятностей от величины порога",
                        		fontSize: 13
                        	},
                        	"legend":{
                        		"text": "legend2"
                        	},
                        	"scale-x":{
    	   						"label":{
    	      						"text":"Величина порога, UGr"
          						}
          					},
          					"scale-y":{
    	   						"label":{
    	      						"text":"Вероятность, P"
          						}
          					},
      						"type": "area", 
      						"plot":{
                				"marker":{
                    				"size":3,
                                    "type" : "line"
                    			}
                    		},
      						"series": [ 
        						{"values":$scope.dataset1,"legend-item":{"text":"pK2rK1"}},
        						{"values":$scope.dataset2,"legend-item":{"text":"pK1rK2"}},
        						{"values":$scope.dataset3,"legend-item":{"text":"prK1rK2"}},
        						{"values":$scope.dataset4,"legend-item":{"text":"prK2rK1"}},
        						{"values":$scope.dataset5,"legend-item":{"text":"nPcorr"}},
        						{"values":$scope.dataset6,"legend-item":{"text":"prK1"}},
        						{"values":$scope.dataset7,"legend-item":{"text":"prK2"}}
      							]						 						
                        	}
                        $scope.render($scope.chartData2,'probability');
                    } //else {...
                } //function() {...
            }, //controller: function($scope){...
            controllerAs: 'lab1'
        };
    });