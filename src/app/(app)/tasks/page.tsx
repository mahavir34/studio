import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { CheckCircle } from 'lucide-react'
import { achievementTasks } from '@/lib/data'
import { Badge } from '@/components/ui/badge'

export default function TasksPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Achievement Tasks</h1>
        <p className="text-muted-foreground">
          Complete tasks to earn bonus rewards and boost your earnings.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {achievementTasks.map((task) => (
          <Card key={task.id} className="flex flex-col">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <CardTitle>{task.title}</CardTitle>
                    <Badge variant="secondary">Reward: ${task.reward}</Badge>
                </div>
              <CardDescription>{task.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
              <div className="space-y-2">
                <Progress value={(task.progress / task.target) * 100} className="h-2" />
                <p className="text-xs text-muted-foreground text-right">
                  {task.progress.toLocaleString()} / {task.target.toLocaleString()}
                </p>
              </div>
            </CardContent>
            <CardFooter>
              {task.isCompleted ? (
                <Button variant="outline" disabled className="w-full">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Completed
                </Button>
              ) : (
                <Button className="w-full" disabled={(task.progress / task.target) * 100 < 100}>
                  Claim Reward
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </section>
    </div>
  )
}
