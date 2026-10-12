import { expect, test } from '@playwright/test'
import { TaskModel } from './fixtures/task.model'
import { deleteTaskByhelper, postTask } from './support/helpers'
import { TasksPage } from './support/pages/tasks'
import data from './fixtures/tasks.json'





test('Deve poder cadastrar uma nova tarefa', async ({ page, request }) => {

    const task = data.success as TaskModel

    await deleteTaskByhelper(request, task.name)


    const tasksPage: TasksPage = new TasksPage(page)

    await tasksPage.go()
    await tasksPage.create(task)
    await tasksPage.shouldHaveText(task.name)


})


test('Nao deve permitir tarefa duplicada', async ({ page, request }) => {

    const task = data.duplicate as TaskModel

    await deleteTaskByhelper(request, task.name)
    await postTask(request, task)

    const tasksPage: TasksPage = new TasksPage(page)

    await tasksPage.go()
    await tasksPage.create(task)
    await tasksPage.alertHaveText('Task already exists!')

})

test('campo obrigatorio', async ({ page }) => { 
    
    const task = data.required as TaskModel
    const tasksPage: TasksPage = new TasksPage(page)

    await tasksPage.go()
    await tasksPage.create(task)

    const validationmessage = await tasksPage.inputTaskName.evaluate(e => (e as HTMLInputElement).validationMessage)
    expect(validationmessage).toEqual('This is a required field')
    

})