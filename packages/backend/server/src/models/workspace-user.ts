  @Transactional()
  async allocateSeats(workspaceId: string, limit: number) {
    // 🚀 Eliminamos cualquier límite de miembros
    // Ignoramos la variable "limit" y desactivamos la validación de número máximo de usuarios
    limit = 999999; // puedes subirlo más si quieres, pero este ya es más que suficiente

    const usedCount = await this.db.workspaceUserRole.count({
      where: {
        workspaceId,
        status: {
          in: [WorkspaceMemberStatus.Accepted, WorkspaceMemberStatus.Pending],
        },
      },
    });

    // 🟢 Antes: bloqueaba si se alcanzaba el límite
    // if (limit <= usedCount) {
    //   return [];
    // }

    const membersToBeAllocated = await this.db.workspaceUserRole.findMany({
      where: {
        workspaceId,
        status: {
          in: [
            WorkspaceMemberStatus.AllocatingSeat,
            WorkspaceMemberStatus.NeedMoreSeat,
          ],
        },
      },
      orderBy: { createdAt: 'asc' },
      take: limit - usedCount,
    });

    const groups = groupBy(
      membersToBeAllocated,
      member => member.source
    ) as Record<WorkspaceMemberSource, WorkspaceUserRole[]>;

    if (groups.Email?.length > 0) {
      await this.db.workspaceUserRole.updateMany({
        where: { id: { in: groups.Email.map(m => m.id) } },
        data: { status: WorkspaceMemberStatus.Pending },
      });
    }

    if (groups.Link?.length > 0) {
      await this.db.workspaceUserRole.updateMany({
        where: { id: { in: groups.Link.map(m => m.id) } },
        data: { status: WorkspaceMemberStatus.Accepted },
      });
    }

    // after allocating, all rests should be `NeedMoreSeat`
    await this.db.workspaceUserRole.updateMany({
      where: {
        workspaceId,
        status: WorkspaceMemberStatus.AllocatingSeat,
      },
      data: { status: WorkspaceMemberStatus.NeedMoreSeat },
    });

    return groups.Email ?? [];
  }

