/**
 * mysql数组转化为
 * select=>insert二维数组
 */

// [
//     [
//         { user_name: "admin1" },
//         { user_name: "admin2" },
//         { user_name: "admin3" }
//     ],
//     [
//         { user_name: "admin4" },
//         { user_name: "admin5" },
//         { user_name: "admin6" }
//     ],
//     [
//         { user_name: "admin7" },
//         { user_name: "admin8" },
//         { user_name: "admin9" }
//     ]
// ]
// 转化为 ==>>
// [
//     ["admin1"],
//     ["admin2"],
//     ["admin3"],
//     ["admin4"],
//     ["admin5"],
//     ["admin6"],
//     ["admin7"],
//     ["admin8"],
//     ["admin9"]
// ]


var values = [] //一维数组
var arr2 = [
    [
        { user_name: "admin1" },
        { user_name: "admin2" },
        { user_name: "admin3" }
    ],
    [
        { user_name: "admin4" },
        { user_name: "admin5" },
        { user_name: "admin6" }
    ],
    [
        { user_name: "admin7" },
        { user_name: "admin8" },
        { user_name: "admin9" }
    ]
]
var index = 0; var num = arr2[0].length;
for(var element in arr2){
	for(key in arr2[element]){
		console.log(Number(key) + num*index)
		values[Number(key) + num*index] = new Array();
		values[Number(key) + num*index][0] =  arr2[element][key].user_name;
	}
	index++
}
console.log(values)
