import { Pica } from './sdk'
import {
    log,
    loadEnv,
} from './utils'
import ora from 'ora'
import Input from '@inquirer/input'
import Password from '@inquirer/password'
import pico from 'picocolors'
import Table from 'cli-table3'

loadEnv()

async function main() {
    const {
        PICA_ACCOUNT,
        PICA_PASSWORD,
        PICA_IN_GITHUB
    } = process.env

    const account =
        PICA_ACCOUNT ||
        (await Input({
            message: '请输入账户名称',
            transformer: (val) => val.trim()
        }))
    const password =
        PICA_PASSWORD ||
        (await Password({
            message: '请输入账户密码',
            mask: true
        }))

    const spinner = ora('正在登录哔咔').start()
    const pica = new Pica()
    await pica.login(account, password)
    spinner.stop()
    log.success('登录成功')
    

    spinner.start('正在获取收藏夹信息')
    const res = await pica.favoritesAll()
    log.info(
        `收藏夹共有 ${pico.cyan(res.pages)} 页`
    )
    const table = new Table({
        head: ['cid', 'title']
    })
    res.comics.forEach((item) => table.push([item._id, item.title]))
    spinner.stop()
    console.log('收藏夹全部漫画信息：')
    console.log(table.toString())
}

main()
