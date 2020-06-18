// import express from "express"
// import Mock from "mockjs"
const express = require('express');   //引入express
const Mock = require('mockjs');       //引入mock

const port = '3001'
let app = express();
const Random = Mock.Random;

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});


app.post('/api/search/mrbyuser', function (req, res) {

    let label = Mock.mock([
        {
            "key": "PSSSW-97021",
            "summary": "PLM report should follow TIM solution since R12.0 (include R12.0) for Shanghai packs (For EC)",
            "description": "\nFor PLM reporting,the implementation should follow the below design:\nfaultId 'PLM' is defined with faultType 'NoFault' (doesn't cause FAF in State Qualifier) and this fault is reported when pmmresp=disabled\nfaultId 'PLMRESPENABLE' is defined with faultType 'Faf' (does cause FAF in State Qualifier) and this fault is reported when pmmresp=enabled\n This design is consistent with TIM reporting\nfaultId 'TIM' is defined with faultType 'NoFault' (doesn't cause FAF in State Qualifier) and this fault is reported when timmresp=disabled\nfaultId 'TIMRESPENABLE' is defined with faultType 'Faf' (does cause FAF in State Qualifier) and this fault is reported when timmresp=enabled\nThe below packs will be affected:\n11DPM12,11DPM8,4QPA8,11DPM4M,112SDX11 \n12P120,20P200,8P20,11QPA4B\n\n\n",
            "relatedTo": [
                "person1", "person2",
                "person3", "person4",
            ],
            "viewCount": 100,
            "url": "https://optics-jira.int.net.nokia.com/browse/PSSSW-97021",
            "isCollected": true, //是否收藏
            "isRecycled": false, //是否被回收
            "isLocked": true, //是否被锁定
            "labelList": [
                {
                    "label": "PLM",
                    "score": 5
                },
                {
                    "label": "12.0",
                    "score": 3
                },
                {
                    "label": "TIM",
                    "score": 5
                },
                {
                    "label": "EC",
                    "score": 3
                }
            ]
        },
        {
            "key": "PSSSW-97023",
            "summary": "PLM report should follow TIM solution since R12.0 (include R12.0) for 8P20",
            "description": "\nFor PLM reporting,the implementation should follow the below design:\nfaultId 'PLM' is defined with faultType 'NoFault' (doesn't cause FAF in State Qualifier) and this fault is reported when pmmresp=disabled\nfaultId 'PLMRESPENABLE' is defined with faultType 'Faf' (does cause FAF in State Qualifier) and this fault is reported when pmmresp=enabled\n This design is consistent with TIM reporting\nfaultId 'TIM' is defined with faultType 'NoFault' (doesn't cause FAF in State Qualifier) and this fault is reported when timmresp=disabled\nfaultId 'TIMRESPENABLE' is defined with faultType 'Faf' (does cause FAF in State Qualifier) and this fault is reported when timmresp=enabled\nThe below packs will be affected:\n11DPM12,11DPM8,4QPA8,11DPM4M,112SDX11\n12P120,20P200,8P20,11QPA4B\n For this specific MR, changes shall be for 8P20.\n\n",
            "relatedTo": [
                "person1", "person2",
                "person3", "person4",
            ],
            "viewCount": 100,
            "url": "https://optics-jira.int.net.nokia.com/browse/PSSSW-97023",
            "isCollected": false, //是否收藏
            "isRecycled": false, //是否被回收
            "isLocked": true, //是否被锁定
            "labelList": [
                {
                    "label": "PLM",
                    "score": 5
                },
                {
                    "label": "TIM",
                    "score": 3
                },
                {
                    "label": "12.0",
                    "score": 5
                },
                {
                    "label": "8P20",
                    "score": 3
                }
            ]
        },
        {
            "key": "PSSSW-97025",
            "summary": "PLM report should follow TIM solution since R12.0 (include R12.0) for 11DPM8",
            "description": "\nFor PLM reporting,the implementation should follow the below design:\nfaultId 'PLM' is defined with faultType 'NoFault' (doesn't cause FAF in State Qualifier) and this fault is reported when pmmresp=disabled\nfaultId 'PLMRESPENABLE' is defined with faultType 'Faf' (does cause FAF in State Qualifier) and this fault is reported when pmmresp=enabled\n This design is consistent with TIM reporting\nfaultId 'TIM' is defined with faultType 'NoFault' (doesn't cause FAF in State Qualifier) and this fault is reported when timmresp=disabled\nfaultId 'TIMRESPENABLE' is defined with faultType 'Faf' (does cause FAF in State Qualifier) and this fault is reported when timmresp=enabled\nThe below packs will be affected:\n11DPM12,11DPM8,4QPA8,11DPM4M,112SDX11\n12P120,20P200,8P20,11QPA4B\n For this specific MR, changes shall be for 11DPM8.\n\n",
            "relatedTo": [
                "person1", "person2",
                "person3", "person4",
            ],
            "viewCount": 999,
            "url": "https://optics-jira.int.net.nokia.com/browse/PSSSW-97025",
            "isCollected": true, //是否收藏
            "isRecycled": false, //是否被回收
            "isLocked": false, //是否被锁定
            "labelList": [
                {
                    "label": "PLM",
                    "score": 5
                },
                {
                    "label": "TIM",
                    "score": 3
                },
                {
                    "label": "12.0",
                    "score": 5
                },
                {
                    "label": "8P20",
                    "score": 3
                }
            ]
        }
    ]);
    res.json(label)
});
app.post('/api/search/mrbylabel', function (req, res) {
    console.log("/api/search/mrbylabel");
    let label = Mock.mock([
        {
            "key": "PSSSW-97021",
            "summary": "PLM report should follow TIM solution since R12.0 (include R12.0) for Shanghai packs (For EC)",
            "description": "\nFor PLM reporting,the implementation should follow the below design:\nfaultId 'PLM' is defined with faultType 'NoFault' (doesn't cause FAF in State Qualifier) and this fault is reported when pmmresp=disabled\nfaultId 'PLMRESPENABLE' is defined with faultType 'Faf' (does cause FAF in State Qualifier) and this fault is reported when pmmresp=enabled\n This design is consistent with TIM reporting\nfaultId 'TIM' is defined with faultType 'NoFault' (doesn't cause FAF in State Qualifier) and this fault is reported when timmresp=disabled\nfaultId 'TIMRESPENABLE' is defined with faultType 'Faf' (does cause FAF in State Qualifier) and this fault is reported when timmresp=enabled\nThe below packs will be affected:\n11DPM12,11DPM8,4QPA8,11DPM4M,112SDX11 \n12P120,20P200,8P20,11QPA4B\n\n\n",
            "relatedTo": [
                "person1", "person2",
                "person3", "person4",
            ],
            "viewCount": 100,
            "url": "https://optics-jira.int.net.nokia.com/browse/PSSSW-97021",
            "isCollected": true, //是否收藏
            "isRecycled": false, //是否被回收
            "isLocked": true, //是否被锁定
            "labelList": [
                {
                    "label": "PLM",
                    "score": 5
                },
                {
                    "label": "12.0",
                    "score": 3
                },
                {
                    "label": "TIM",
                    "score": 5
                },
                {
                    "label": "EC",
                    "score": 3
                }
            ]
        },
        {
            "key": "PSSSW-97023",
            "summary": "PLM report should follow TIM solution since R12.0 (include R12.0) for 8P20",
            "description": "\nFor PLM reporting,the implementation should follow the below design:\nfaultId 'PLM' is defined with faultType 'NoFault' (doesn't cause FAF in State Qualifier) and this fault is reported when pmmresp=disabled\nfaultId 'PLMRESPENABLE' is defined with faultType 'Faf' (does cause FAF in State Qualifier) and this fault is reported when pmmresp=enabled\n This design is consistent with TIM reporting\nfaultId 'TIM' is defined with faultType 'NoFault' (doesn't cause FAF in State Qualifier) and this fault is reported when timmresp=disabled\nfaultId 'TIMRESPENABLE' is defined with faultType 'Faf' (does cause FAF in State Qualifier) and this fault is reported when timmresp=enabled\nThe below packs will be affected:\n11DPM12,11DPM8,4QPA8,11DPM4M,112SDX11\n12P120,20P200,8P20,11QPA4B\n For this specific MR, changes shall be for 8P20.\n\n",
            "relatedTo": [
                "person1", "person2",
                "person3", "person4",
            ],
            "viewCount": 100,
            "url": "https://optics-jira.int.net.nokia.com/browse/PSSSW-97023",
            "isCollected": false, //是否收藏
            "isRecycled": false, //是否被回收
            "isLocked": true, //是否被锁定
            "labelList": [
                {
                    "label": "PLM",
                    "score": 5
                },
                {
                    "label": "TIM",
                    "score": 3
                },
                {
                    "label": "12.0",
                    "score": 5
                },
                {
                    "label": "8P20",
                    "score": 3
                }
            ]
        },
        {
            "key": "PSSSW-97025",
            "summary": "PLM report should follow TIM solution since R12.0 (include R12.0) for 11DPM8",
            "description": "\nFor PLM reporting,the implementation should follow the below design:\nfaultId 'PLM' is defined with faultType 'NoFault' (doesn't cause FAF in State Qualifier) and this fault is reported when pmmresp=disabled\nfaultId 'PLMRESPENABLE' is defined with faultType 'Faf' (does cause FAF in State Qualifier) and this fault is reported when pmmresp=enabled\n This design is consistent with TIM reporting\nfaultId 'TIM' is defined with faultType 'NoFault' (doesn't cause FAF in State Qualifier) and this fault is reported when timmresp=disabled\nfaultId 'TIMRESPENABLE' is defined with faultType 'Faf' (does cause FAF in State Qualifier) and this fault is reported when timmresp=enabled\nThe below packs will be affected:\n11DPM12,11DPM8,4QPA8,11DPM4M,112SDX11\n12P120,20P200,8P20,11QPA4B\n For this specific MR, changes shall be for 11DPM8.\n\n",
            "relatedTo": [
                "person1", "person2",
                "person3", "person4",
            ],
            "viewCount": 999,
            "url": "https://optics-jira.int.net.nokia.com/browse/PSSSW-97025",
            "isCollected": true, //是否收藏
            "isRecycled": false, //是否被回收
            "isLocked": false, //是否被锁定
            "labelList": [
                {
                    "label": "PLM",
                    "score": 5
                },
                {
                    "label": "TIM",
                    "score": 3
                },
                {
                    "label": "12.0",
                    "score": 5
                },
                {
                    "label": "8P20",
                    "score": 3
                }
            ]
        }
    ]);
    res.json(label)
});
app.post('/api/search/mrbymr', function (req, res) {
    console.log("/api/search/mrbymr");
    let label = Mock.mock([
        {
            "key": "PSSSW-97021",
            "summary": "PLM report should follow TIM solution since R12.0 (include R12.0) for Shanghai packs (For EC)",
            "description": "\nFor PLM reporting,the implementation should follow the below design:\nfaultId 'PLM' is defined with faultType 'NoFault' (doesn't cause FAF in State Qualifier) and this fault is reported when pmmresp=disabled\nfaultId 'PLMRESPENABLE' is defined with faultType 'Faf' (does cause FAF in State Qualifier) and this fault is reported when pmmresp=enabled\n This design is consistent with TIM reporting\nfaultId 'TIM' is defined with faultType 'NoFault' (doesn't cause FAF in State Qualifier) and this fault is reported when timmresp=disabled\nfaultId 'TIMRESPENABLE' is defined with faultType 'Faf' (does cause FAF in State Qualifier) and this fault is reported when timmresp=enabled\nThe below packs will be affected:\n11DPM12,11DPM8,4QPA8,11DPM4M,112SDX11 \n12P120,20P200,8P20,11QPA4B\n\n\n",
            "relatedTo": [
                "person1", "person2",
                "person3", "person4",
            ],
            "viewCount": 100,
            "url": "https://optics-jira.int.net.nokia.com/browse/PSSSW-97021",
            "isCollected": true, //是否收藏
            "isRecycled": false, //是否被回收
            "isLocked": true, //是否被锁定
            "labelList": [
                {
                    "label": "PLM",
                    "score": 5
                },
                {
                    "label": "12.0",
                    "score": 3
                },
                {
                    "label": "TIM",
                    "score": 5
                },
                {
                    "label": "EC",
                    "score": 3
                }
            ]
        },
        {
            "key": "PSSSW-97023",
            "summary": "PLM report should follow TIM solution since R12.0 (include R12.0) for 8P20",
            "description": "\nFor PLM reporting,the implementation should follow the below design:\nfaultId 'PLM' is defined with faultType 'NoFault' (doesn't cause FAF in State Qualifier) and this fault is reported when pmmresp=disabled\nfaultId 'PLMRESPENABLE' is defined with faultType 'Faf' (does cause FAF in State Qualifier) and this fault is reported when pmmresp=enabled\n This design is consistent with TIM reporting\nfaultId 'TIM' is defined with faultType 'NoFault' (doesn't cause FAF in State Qualifier) and this fault is reported when timmresp=disabled\nfaultId 'TIMRESPENABLE' is defined with faultType 'Faf' (does cause FAF in State Qualifier) and this fault is reported when timmresp=enabled\nThe below packs will be affected:\n11DPM12,11DPM8,4QPA8,11DPM4M,112SDX11\n12P120,20P200,8P20,11QPA4B\n For this specific MR, changes shall be for 8P20.\n\n",
            "relatedTo": [
                "person1", "person2",
                "person3", "person4",
            ],
            "viewCount": 100,
            "url": "https://optics-jira.int.net.nokia.com/browse/PSSSW-97023",
            "isCollected": false, //是否收藏
            "isRecycled": false, //是否被回收
            "isLocked": true, //是否被锁定
            "labelList": [
                {
                    "label": "PLM",
                    "score": 5
                },
                {
                    "label": "TIM",
                    "score": 3
                },
                {
                    "label": "12.0",
                    "score": 5
                },
                {
                    "label": "8P20",
                    "score": 3
                }
            ]
        },
        {
            "key": "PSSSW-97025",
            "summary": "PLM report should follow TIM solution since R12.0 (include R12.0) for 11DPM8",
            "description": "\nFor PLM reporting,the implementation should follow the below design:\nfaultId 'PLM' is defined with faultType 'NoFault' (doesn't cause FAF in State Qualifier) and this fault is reported when pmmresp=disabled\nfaultId 'PLMRESPENABLE' is defined with faultType 'Faf' (does cause FAF in State Qualifier) and this fault is reported when pmmresp=enabled\n This design is consistent with TIM reporting\nfaultId 'TIM' is defined with faultType 'NoFault' (doesn't cause FAF in State Qualifier) and this fault is reported when timmresp=disabled\nfaultId 'TIMRESPENABLE' is defined with faultType 'Faf' (does cause FAF in State Qualifier) and this fault is reported when timmresp=enabled\nThe below packs will be affected:\n11DPM12,11DPM8,4QPA8,11DPM4M,112SDX11\n12P120,20P200,8P20,11QPA4B\n For this specific MR, changes shall be for 11DPM8.\n\n",
            "relatedTo": [
                "person1", "person2",
                "person3", "person4",
            ],
            "viewCount": 999,
            "url": "https://optics-jira.int.net.nokia.com/browse/PSSSW-97025",
            "isCollected": true, //是否收藏
            "isRecycled": false, //是否被回收
            "isLocked": false, //是否被锁定
            "labelList": [
                {
                    "label": "PLM",
                    "score": 5
                },
                {
                    "label": "TIM",
                    "score": 3
                },
                {
                    "label": "12.0",
                    "score": 5
                },
                {
                    "label": "8P20",
                    "score": 3
                }
            ]
        }
    ]);
    res.json(label)
});

app.use('/api/search/labelbylabel', function (req, res) {
    console.log("/api/search/labelbylabel");
    let label = Mock.mock({
        "labelList:|10": [
            {
                "label|+1": ["8dc30", "2ux200", "aa2donwb", "1ux200", "1830pss8f", "amplifier", "6se300", "8p20", "130snx10", "1ud200"],
                "score|+1": [5, 4, 3, 2, 1]
            },
        ]
    });
    res.json(label)
});

app.post('/api/search/labelbyuser', function (req, res) {
    console.log("/api/search/labelbyuser");
    let label = Mock.mock({
        "defaultLabelList|10": [
            {
                "label|+1": ["8dc30", "2ux200", "aa2donwb", "1ux200", "1830pss8f", "amplifier", "6se300", "8p20", "130snx10", "1ud200"],
                "score|+1": [5, 4, 3, 2, 1]
            },
        ],
        "choosedLabelList|10": [
            {
                "label|+1": ["8dc30", "2ux200", "aa2donwb", "1ux200"],
                "score|+1": [5, 4, 3, 2, 1]
            },
        ]
    });
   
    res.json(label)
});

app.post('/api/login', function (req, res) {
    console.log("/api/login");
    let login = Mock.mock({
        "token":"1234567890",
        "isSuccess":true,
        "isNewUser":true,//true为首次登陆,false为非首次登陆
    });
    res.json(login)
});


// jira filters
app.post('/api/favourite', function (req, res) {
    console.log("/jiradata");
    let data = Mock.mock([
        {
          "name": "FT IONPLM",
          "searchUrl": "https://optics-jira.int.net.nokia.com/rest/api/2/search?jql=project+%3D+IONPLM",
          "id": "54158"
        },
        {
          "name": "FT OCS HW",
          "searchUrl": "https://optics-jira.int.net.nokia.com/rest/api/2/search?jql=project+%3D+%22OCS+Hardware+(1830PSS64/36)%22",
          "id": "56366"
        },
        {
          "name": "FT OCS KPL",
          "searchUrl": "https://optics-jira.int.net.nokia.com/rest/api/2/search?jql=project+%3D+%22OCS+(1830PSS36/64)+KPL+MRs%22",
          "id": "56368"
        },
        {
          "name": "FT OCS SW",
          "searchUrl": "https://optics-jira.int.net.nokia.com/rest/api/2/search?jql=project+%3D+%22OCS+Software+(1830PSS64/36)%22",
          "id": "56364"
        },
        {
          "name": "FT PSS BLI",
          "searchUrl": "https://optics-jira.int.net.nokia.com/rest/api/2/search?jql=project+%3D+PSSBLI",
          "id": "54160"
        }
    ]);
    res.json(data);
});
// jira data
app.post('/api/issues', function (req, res) {
    console.log("/jiradata");
    let data = Mock.mock({
        "startAt": 0,
        "maxResults": 2,
        "total": 7763,
        "issues": [
      {
      "key": "OCSSW-7874",
      "summary": "Different default alarm porfile value for 1AN100G when client type changed",
              "assignee": null,
              "reporter": "Yan Zhang",
              "project": "OCS Software (1830PSS64/36)",
              "description": "NE: PSS64\r\n\r\nSW: 12.00.04\r\n\r\nProblem Description:\r\n # unassign/assign 1AN100G, and OTU4 client type is provisioned\r\n # check the alarm profile, which is LBL-ASAPOTU-SYSDFLT\r\n # change client type to GBE100ODU4\r\n # re-check the alarm profile, which is changed to LBL-ASAPGBE100-ALL\r\n\r\nThis problem is also raised both on 2AN40G and 10AN10GC",    
              "priority": "3 - Minor",
              "status": "New",
              "created": "2019-06-24T07:33:25.000+0000",
      "updated": "2019-06-24T07:09:13.000+0000"
          },
      {
      "key": "OCSSW-7874",
      "summary": "Different default alarm porfile value for 1AN100G when client type changed",
              "assignee": null,
              "reporter": "Yan Zhang",
              "project": "OCS Software (1830PSS64/36)",
              "description": "NE: PSS64\r\n\r\nSW: 12.00.04\r\n\r\nProblem Description:\r\n # unassign/assign 1AN100G, and OTU4 client type is provisioned\r\n # check the alarm profile, which is LBL-ASAPOTU-SYSDFLT\r\n # change client type to GBE100ODU4\r\n # re-check the alarm profile, which is changed to LBL-ASAPGBE100-ALL\r\n\r\nThis problem is also raised both on 2AN40G and 10AN10GC",    
              "priority": "3 - Minor",
              "status": "New",
              "created": "2019-06-24T07:33:25.000+0000",
      "updated": "2019-06-24T07:09:13.000+0000"
          }
        ]
      });
    res.json(data);
});

app.listen(port, () => {
    console.log('监听端口 ' + port)
})