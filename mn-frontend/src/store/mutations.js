/**
 * Mutations业务层数据提交
 */
import storage from './../utils/storage'

export default {
    saveUserInfo(state, userInfo) {
        state.userInfo = userInfo;
        storage.setItem('userInfo', userInfo)
    },
    saveActionList(state, actionList) {
        state.actionList = actionList;
        storage.setItem('actionList', actionList)
    },
}