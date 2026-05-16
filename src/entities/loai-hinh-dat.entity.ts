/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('LOAIHINHDAT')
export class LoaiHinhDat {
    @PrimaryGeneratedColumn("uuid")
    maLoaiDat!: string;

    @Column({ type: "varchar" })
    tenLoaiDat!: string;

    @Column({ type: "varchar", unique: true, nullable: true })
    code!: string; // e.g., "HOUR", "MONTHLY"
}