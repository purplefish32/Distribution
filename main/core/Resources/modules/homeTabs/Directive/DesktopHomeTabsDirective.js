/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export default class DesktopHomeTabsDirective {

    constructor() {
        this.restrict = 'E'
        this.replace = true
        this.template = require('../Partial/desktop_home_tabs.html')
    }
}