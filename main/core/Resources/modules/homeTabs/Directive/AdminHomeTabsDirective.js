/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export default class AdminHomeTabsDirective {

    constructor() {
        this.restrict = 'E'
        this.replace = true
        this.template = require('../Partial/admin_home_tabs.html')
    }
}