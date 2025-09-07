package com.condoflow.expense.expense;

import java.util.Set;

public enum Tower {
    A,
    B,
    C,
    D;

    public static Set<Tower> sectorAB() {
        return Set.of(A, B);
    }

    public static Set<Tower> sectorCD() {
        return Set.of(C, D);
    }
}
