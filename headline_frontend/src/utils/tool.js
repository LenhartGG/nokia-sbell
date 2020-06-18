
/**
 * Tools for Headline
 */

/**
 * findIndex
 * @param {array} arr 
 * @param {function} fn 
 */
export let findIndex = function(arr, fn) {
    return arr.reduce(function(carry, item, idx) {
        if(fn(item, idx)) {
            return idx;
        }

        return carry;
    } , -1);
};

/**
 * setBodyColor
 * @param {string} color '#2E323F'
 */
export let setBGColorForBody = (color) => {
  document.body.style.backgroundColor =  color;
}