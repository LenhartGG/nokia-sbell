/**
 * 接口列表
 */
import {axios, get, post} from '@/request/http.js'

//sso login
export let toLogin = (data) => {
    return post('/api/login',data);
};

export let getUserInfo = () => {
    return get( '/api/getUserInfo' );
};

export let getDataVersion = () => {
    return get( '/api/getDataVersion' );
};

// favourite filter
export let getjirafilterdata = (data) => {
    return get( '/api/favourite', data);
}

/**
 * newAssigneeToMe
 * @param {*} data {'url':'', page:1, row: 50, sortBy: { fieldName: 'created', order: 'DESC' }}
 */ 
export let newAssigneeToMe = (data) => {
    return post( '/api/newAssigneeToMe', data);
}
/**
 * newReportedByMe
 * @param {*} data {'url':'', page:1, row: 50, sortBy: { fieldName: 'created', order: 'DESC' }}
 */ 
export let newReportedByMe = (data) => {
    return post( '/api/newReportedByMe', data);
}

/**
 * newOpenMRForManager
 * @param {*} data {'url':'', page:1, row: 50, sortBy: { fieldName: 'created', order: 'DESC' }}
 */ 
export let newOpenMRForManager = (data) => {
    return post( '/api/newOpenMRForManager', data);
}


/**
 * assigneMR
 * @param {*} data {key":"", "assinger":"ypli"}
 */ 
export let assigneMR = (data) => {
    return post( '/api/assigneMR', data);
}

/**
 * recomendMR
 * @param {*} data {key":"", "assinger":"ypli"}
 */ 
// {
//     "key":"PSSSW-98983",
//     "recomender":["ypli"],
//     "comment":"test headline assignee"
//     }
export let recomendMR = (data) => {
    return post( '/api/recomendMR', data);
}

// homepage
export let filterCount = () => {
    return get( '/api/filter/count' );
}

// api/search/changelog
export let changelog = () => {
    return get( 'api/search/changelog' );
}

// api/search/hotIssues
export let hotIssues = () => {
    return get( 'api/search/hotIssues');
}

// session1 table
export let getJiraData = (data) => {
    return post( '/api/jiraIssues', data);
}


/**
 * search mr by user
 * @param {*} data e.g. {"user":"zhangsan"}
 */
export let mrByUser = (data) => {
    return post('/api/search/mrbyuser', data);
};

/**
 * search mr by mr
 * @param {*} data e.g. {key: PSSSW-102668, count: 50}
 */
export let mrByMR = (data) => {
    return get('/api/search/mrbymr',data);
};

/**
 * search mr by label
 * @param {*} data e.g. {"label": "labelExample"}
 */
export let mrByLabel = (data) => {
    return post('/api/search/mrbylabel',data);
};

/**
 *  addWatch 添加关注并关联到jira
 * {"key":"PSSSW-1"}
 */
export let addWatch = (data) => {
    return post('/api/issue/addWatch',data);
};

/**
 *  addWatch 添加关注并关联到jira
 * {"key":"PSSSW-1"}
 */
export let deleteWatch = (data) => {
    return post('/api/issue/deleteWatch',data);
};